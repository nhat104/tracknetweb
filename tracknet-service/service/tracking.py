import torch
import torchvision
import cv2 as cv
import numpy as np
from .TrackNet import TrackNet
from argparse import Namespace
from ultralytics import YOLO
from PIL import Image

model_path = "service/model_weight/best-yolo.pt"
model = YOLO(model_path)
# opt = Namespace(
#     **{
#         "grayscale": False,
#         "sequence_length": 1,
#         "dropout": 0,
#         "one_output_frame": False,
#     }
# )
# model = TrackNet(opt)
# model.eval()


def inference(model, img, image_size=(360, 640)):
    rgb_image = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    image = torchvision.transforms.ToTensor()(rgb_image)
    image = torchvision.transforms.Resize(size=image_size, antialias=True)(image)
    image = image.type(torch.float32)
    image = image.unsqueeze(0)

    pred = model(image)
    pred_frame = pred[0, 0]
    pred_frame = pred_frame.detach().numpy()

    y, x = np.where(pred_frame == np.max(pred_frame))
    x, y = x[0], y[0]

    h, w = img.shape[:2]
    center = (int(x / image_size[1] * w), int(y / image_size[0] * h))
    return center

# generalization for cannot detected point
def interpolation_center_point(history_centers):
    centers = history_centers.copy()
    anchor_point = []
    for i, center in enumerate(centers):
        if center != ():
            anchor_point.append(i)

    for i in range(len(anchor_point)-1):
        sanchor = centers[anchor_point[i]]
        fanchor = centers[anchor_point[i+1]]

        t = anchor_point[i+1] - anchor_point[i]

        v = (fanchor[0] - sanchor[0]) / t, (fanchor[1] - sanchor[1]) / t
        for j in range(anchor_point[i]+1, anchor_point[i+1]):
            centers[j] = (fanchor[0] + v[0] * (j-anchor_point[i]-1),
                          fanchor[1] + v[1] * (j-anchor_point[i]-1))
    return centers
  

def tracking_service(filename):
    # model = TrackNet(opt)
    # model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    # model.eval()
    batch_size = 64
    
    cap = cv.VideoCapture(filename)
    width, height = int(cap.get(3)), int(cap.get(4))
    fps = cap.get(cv.CAP_PROP_FPS)
    print(f"Original video 's fps is {fps}")
    
    out = cv.VideoWriter("static/"+filename.split("/")[-1], cv.VideoWriter_fourcc(*'H264'), fps, (width, height))
    
    
    i = 0
    
    center = (0, 0)
    frames = []
    bboxes = []
    
    i = 0
    batch_size = 128
    frames = []
    bboxes = []

    while True:
        i += 1
        ret, frame = cap.read()

        if not ret:
            if len(frames) == 0:
                break
            results = model(frames, verbose=False)
            frames = []
            for result in results:
                bbox = result.boxes.data
                if bbox.shape[0] == 0:
                    bboxes.append(())
                else:
                    x1, y1, x2, y2 = bbox[0, 0], bbox[0, 1], bbox[0, 2], bbox[0, 3]
                    x, y = (x1 + x2) / 2, (y1 + y2) / 2
                    bboxes.append((x, y))
            break

        rgb_frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        PIL_frame = Image.fromarray(rgb_frame)
        frames.append(PIL_frame)
        

        if len(frames) == batch_size:
            results = model(frames)
            for i, result in enumerate(results):
                bbox = result.boxes.data
                if bbox.shape[0] == 0:
                    bboxes.append(())
                    frame = np.asarray(frames[i])
                    frame = cv.cvtColor(frame, cv.COLOR_RGB2BGR)
                    out.write(frame)
                else:
                    x1, y1, x2, y2 = bbox[0, 0], bbox[0, 1], bbox[0, 2], bbox[0, 3]
                    x, y = (x1 + x2) / 2, (y1 + y2) / 2
                    bboxes.append((x, y))
                    
                    center = (x, y)
                    center = int(center[0]), int(center[1])
        
                    frame = np.asarray(frames[i])
                    frame = cv.cvtColor(frame, cv.COLOR_RGB2BGR)
                    output_frame = cv.circle(frame, center, 5, (0, 255, 255), 2)
                    out.write(output_frame)
            frames = []
            
    # centers = interpolation_center_point(bboxes)
    # cap.release()
    
    
    # cap = cv.VideoCapture(filename)
         
    # i = 0
    # while True:
    #     ret, frame = cap.read()
    #     if not ret:
    #         print(f"Hello {i}")
    #         break
        
    #     center = centers[i]
    #     if center == ():
    #         continue
        
    #     center = int(center[0]), int(center[1])
        
    #     output_frame = cv.circle(frame, center, 5, (0, 255, 255), 2)
    #     out.write(output_frame)
    #     i += 1
    
    out.release()
    print(f"{i} done")
    return


def detection(filename):
    img = Image.open(filename)
    result = model(img)
    result = result[0]
    
    bbox = result.boxes.data
    if bbox.shape[0] == 0:
        return "Cannot detect ball"
    else:
        img = np.array(img)
        center = int((bbox[0, 0]+bbox[0, 2]) / 2), int((bbox[0, 1]+bbox[0, 3]) / 2)
        img = cv.circle(img, center, 5, (0, 255, 0), 2)
        img = Image.fromarray(img)
        img.save("static/" + filename.split("/")[-1])