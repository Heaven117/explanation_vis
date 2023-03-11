from flask import Flask
from flask import request, jsonify, json, redirect
from flask import render_template
from waitress import serve

import numpy as np
np.random.seed(12345)

# ------ Initialize WebApp ------- #
app = Flask(__name__)

@app.route('/getInstance')
def getInstance():
	idx = request.args
	print(request.args)
	return json.dumps({"idx":"sdsds"})
	

@app.route('/getAllData')
def getAllData():
	idx = request.args
	print(request.args)
	return json.dumps({"idx":"sdsds"})
	

# ------- Run WebApp ------- #

if __name__ == '__main__':
	app.run(port=3001, host="0.0.0.0", debug=True)
	# serve(app, port=3001)