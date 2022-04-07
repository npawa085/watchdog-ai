import cv2
import sys
import numpy as np
import os
import requests
import json
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer/trainer.yml')
cascadePath = "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascadePath);
font = cv2.FONT_HERSHEY_SIMPLEX
#iniciate id counter
id = 0
# names related to ids: example ==> Marcelo: id=1,  etc
# splits incoming list of args by ,
temp= sys.argv[1].split(',')
final = ["None"] + temp
names = final
# Initialize and start realtime video capture
cam = cv2.VideoCapture(0)
cam.set(3, 640) # set video widht
cam.set(4, 480) # set video height
# Define min window size to be recognized as a face
minW = 0.1*cam.get(3)
minH = 0.1*cam.get(4)
while True:
    ret, img =cam.read()
   # img = cv2.flip(img, -1) # Flip vertically
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    
    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.2,
        minNeighbors = 5,
        minSize = (int(minW), int(minH)),
       )
    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
        
        # If confidence is less them 100 ==> "0" : perfect match 
        if (confidence < 100):
            id_disp = names[id]
            print(id_disp + " and " + " {0}%".format(round(confidence)))
            confidence_disp = "  {0}%".format(round(100 - confidence))
            #print(id + " and " + confidence)
            # if confidence is above 30% (lower than 70%),
            if (confidence < 70):
                #then send REST request to /detect for KNOWN face of names[id] and id
                #url = "https://localhost:3003/detect"
                url = "https://watchdog.free.beeceptor.com/detect"
                data = {'id':id, 'name':id_disp}
                n = requests.post(url, data = data)
                print(n.text)
                #response = json.loads(n.text)
                #print(response)
        else:
            id_disp = "unknown"
            print(id_disp + " and " + " {0}%".format(round(confidence)))
            confidence_disp = "  {0}%".format(round(100 - confidence))
            if (confidence > 130):
                #send REST request to /detect for UNKNOWN face id: null, name: null
                #url = "https://localhost:3003/detect"
                url = "https://watchdog.free.beeceptor.com/detect"
                data = {'id': id_disp, 'name': id_disp}
                n = requests.post(url, data=data)
                print(n.text)

        cv2.putText(
                    img, 
                    str(id_disp),
                    (x+5,y-5), 
                    font, 
                    1, 
                    (255,255,255), 
                    2
                   )
        cv2.putText(
                    img, 
                    str(confidence_disp),
                    (x+5,y+h-5), 
                    font, 
                    1, 
                    (255,255,0), 
                    1
                   )  
    
    cv2.imshow('camera',img) 
    k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
    if k == 27:
        break
# Do a bit of cleanup
print("\n [INFO] Exiting Program and cleanup stuff")
cam.release()
cv2.destroyAllWindows()