from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from service.tracking import tracking_service, detection

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/")
def hello():
    return "Hello, World!"
  
# @app.route("/tracknet")
# async def inference_tracknet():
#     print("Processing video ...")
#     await tracking_service()
#     return "hello"

@app.route("/uploader", methods=["POST"])
def upload_file():
    f = request.files['file']
    filename = f"service/{f.filename}"
    f.save(filename)
    
    print(filename)
    print("hello")
    
    if filename.endswith(".mp4"):
        print("hello")
        print("Processing video ...")
        tracking_service(filename=filename)
        return {
            "video_path": "http://localhost:5000/static/" + f.filename,
        }
        
    elif filename.endswith(".jpg"):
        print("Processing image")
        res = detection(filename)
        if res == "Cannot detect ball":
            return {
                "message": "no detection in image"
            }
        else:
            return {
                "image_path": "http://localhost:5000/static/" + f.filename 
            }
        
          
if __name__ == "__main__":
    app.run()