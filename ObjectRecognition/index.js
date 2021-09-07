const img = document.getElementById('img');
const img2 = document.getElementById('img2');
const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');
const context = canvas.getContext('2d');
const context2 = canvas2.getContext('2d');
context.drawImage(img , 0, 0);
context2.drawImage(img2,0,0);
context2.font = "15px Arial";
context.font = '20px Arial';

cocoSsd.load().then(model => {
    // detect objects in the image.
    model.detect(img).then(predictions => {
      for(let i = 0; i<predictions.length;i++)
      {
          if(predictions[i].class == "stop sign"){
        context.beginPath();
        context.rect(...predictions[i].bbox);
        context.lineWidth = 5;//grubość obramówki
        context.strokeStyle = 'green';//kolor obramówki
        context.fillStyle = 'green';//kolor tekstu
        context.stroke();
        context.fillText(
            predictions[i].score.toFixed(3) + ' ' + predictions[i].class, predictions[i].bbox[0],
            predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 100);
        }
      }
    });
  });

  cocoSsd.load().then(model => {
    // detect objects in the image.
    model.detect(img2).then(predictions => {
      for(let i = 0; i<predictions.length;i++)
      {
        if(predictions[i].class == "car"){
        context2.beginPath();
        context2.rect(...predictions[i].bbox);
        context2.lineWidth = 3;//grubość obramówki
        context2.strokeStyle = 'red';//kolor obramówki
        context2.fillStyle = 'red';//kolor tekstu
        context2.stroke();
        context2.fillText(
            predictions[i].score.toFixed(3) + ' ' + predictions[i].class, predictions[i].bbox[0],
            predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
        }
      }
    });
  });

  