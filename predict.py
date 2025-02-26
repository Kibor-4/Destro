import sys
import json
from your_python_file import predict_price #replace your_python_file with the name of the python file that contains the predict_price function.

house_data = json.loads(sys.argv[1])
model_path = sys.argv[2]

predicted_price = predict_price(house_data, model_path)

print(predicted_price)