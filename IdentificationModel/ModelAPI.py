import io
import json

from torchvision import models
import torchvision.transforms as transforms
from PIL import Image
from IdentificationModel import idModel
import torch as pt
from flask import Flask, jsonify, request


app = Flask(__name__)
imagenet_class_index = json.load(open('./imagenetClassIndices.json'))
model = idModel.load_from_checkpoint('./checkpoint.ckpt', map_location=pt.device('cpu'))
model.eval()

def transform_image(image_bytes):
    transformList = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.CenterCrop(224),
            transforms.ColorJitter(brightness=0, contrast=2.0, saturation=0, hue=0),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])
    image = Image.open(io.BytesIO(image_bytes))
    return transformList(image).unsqueeze(0)


def get_prediction(image_bytes):
    tensor = transform_image(image_bytes=image_bytes) 
    outputs = model.forward(tensor)
    percentages = pt.nn.functional.softmax(outputs, dim=1)[0] * 100

    #convert to dictionary
    class_names = []
    probabilities = []
    for i in range(len(percentages)):
        class_names.append(imagenet_class_index[str(i)])
        probabilities.append(percentages[i].item())

    #Sort arrays by probability
    class_names, probabilities = zip(*sorted(zip(class_names, probabilities), key=lambda x: x[1], reverse=True))

    prediction = json.dumps({
        "class_names": class_names,
        "probabilities": probabilities
    })

    return prediction


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        img_bytes = file.read()
        return get_prediction(image_bytes=img_bytes)

# Main function
if __name__ == '__main__':
    app.run()