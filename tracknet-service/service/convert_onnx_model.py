# import torch
# import torchvision
# import cv2 as cv
# import numpy as np
# from .TrackNet import TrackNet
# from argparse import Namespace

# model_path = "./model_weight/best-custom-dataset.pth"
# video_path = "service/tennis.mp4"
# output_path = "static/inference.mp4"
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

# x = torch.rand(1, 3, 360, 640)
# y = model(x)

# torch.onnx.export(
#   model,
#   x,
#   "./model_weight/tracknet.onnx",
#   export_params=True,
#   opset_version=10,
  
# )