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
    percentage = pt.nn.functional.softmax(outputs, dim=1)[0] * 100
    topk = pt.topk(percentage, len(percentage))

    class_names = []
    probabilities = []
    for index, value in enumerate(topk[1]):
        class_names.append(imagenet_class_index[str(index)])
        probabilities.append(value.item() / 100)
    
    # Sort the probabilities tuple in reverse order.
    sorted_probabilities = sorted(probabilities, reverse=True)

    # Create a dictionary to map probabilities to class names.
    class_name_map = {}
    for index, probability in enumerate(probabilities):
        class_name_map[probability] = class_names[index]

    # Create a list of sorted class names.
    sorted_class_names = []
    for probability in sorted_probabilities:
        sorted_class_names.append(class_name_map[probability])

    prediction = json.dumps({
        "class_names": sorted_class_names,
        "probabilities": sorted_probabilities
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