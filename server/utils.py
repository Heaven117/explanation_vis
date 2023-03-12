import json
import numpy as np
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        if isinstance(obj, int):
            return int(obj)
        elif isinstance(obj, float):
            return float(obj)
        elif isinstance(obj, np.ndarray):
           return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

def toJson(data):
    return json.dumps(data,cls=MyEncoder)


