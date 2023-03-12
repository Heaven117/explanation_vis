from flask import Flask
from flask import request, jsonify, redirect
import json
from flask import render_template
from waitress import serve
from influence import *
import numpy as np
from utils import toJson

from utils import MyEncoder
np.random.seed(12345)

# ------- Initialize file ------- #
BASEDIR = './server/data/'
# 原始数据
data_file = BASEDIR+'final_data_file.csv'
raw_data = pd.read_csv(data_file, header=None).values

# 影响函数
with open(BASEDIR + 'influence.json','r',encoding = 'utf-8') as fp:
    influenceData = json.load(fp)
    print('=====influence file read done')
fp.close()




# ------ Initialize WebApp ------- #
app = Flask(__name__)

@app.route('/getInstance')
def getInstance():
    idx = -10
    raw_data_len = len(raw_data)
    try:
        idx = int(request.args.get('params'))
    except:
        return f"Please enter a sample number in the range (1, ${raw_data_len})."
    
    if idx<0 or idx>raw_data_len:
        return f"Please enter a sample number in the range (1, ${raw_data_len})."
    else:			
        sample = raw_data[idx]
        return toJson(sample)
    

@app.route('/getAllData')
def getAllData():
    idx = request.args
    print(request.args)

    return json.dumps({"idx":"sdsds"})

# 获取相似数据-影响训练点
@app.route('/getSimilarData')
def getSimilarData():
    idx = request.args['params']
    total = influenceData['total']
    inData = influenceData[str(idx)]
    time = inData['time_calc_influence_s']
    influence = inData['influence']
    harmful=inData['harmful']
    helpful = inData['helpful']

    response = {}
    response['total'] = total
    response['time'] = time
    response['harmful'] = []
    response['helpful'] = []
    for i in range(len(harmful)):
        response['harmful'].append({
            'id': harmful[i],
            'value': influence[harmful[i]],
        })
        response['helpful'].append({
            'id': helpful[i],
            'value': influence[helpful[i]],
        })
    return toJson(response)



# ------- Run WebApp ------- #

if __name__ == '__main__':
    # app.run(port=3001, host="0.0.0.0", debug=True)
    serve(app, host="0.0.0.0",port=3001)