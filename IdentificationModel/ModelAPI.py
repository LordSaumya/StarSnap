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
model = idModel.load_from_checkpoint('<PATH/TO/CHECKPOINT>')
model.eval()

def transform_image(image_bytes):
    transformList = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.center_crop(224),
            transforms.adjust_contrast(contrast_factor=2),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])
    image = Image.open(io.BytesIO(image_bytes))
    return transformList(image).unsqueeze(0)


def get_prediction(image_bytes):
    tensor = transform_image(image_bytes=image_bytes)
    outputs = model.forward(tensor)
    percentage = pt.nn.functional.softmax(outputs, dim=1)[0] * 100
    top3 = pt.topk(percentage, 3)
    return [(imagenet_class_index[str(idx)], percentage[idx].item()) for idx in top3.indices[0]]


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        img_bytes = file.read()
        return jsonify(get_prediction(image_bytes=img_bytes))


if __name__ == '__main__':
    app.run()