//Uchwyt do video
const video = document.getElementById('video');
const expressionHandle = document.getElementById('expression-container');
const container = document.getElementById('container')
let happinessValue = 0;
let sadnessValue = 0;
let neutralValue = 0;
let disgustValue = 0;
let surpriseValue = 0;
let angerValue = 0;
let fearValue = 0;
let timer = 595;

//ŁADOWANIE Z FACEAPI
//------------------------------------------------------------------------------------
//Ładowanie asynchroniczne wszystkich modeli jednocześnie
Promise.all([
    //Ładowanie z folderu models
    //Face detector tylko że lekki i szybki
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    //Wykrywanie landmakrów czyli brwi, now etc.
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    //Wykrycie twarzy na podstawie boxa wokół niej
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    //Rozpoznawanie emocji
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

//USTAWIENIE KAMERKI
//----------------------------------------------------------------------------------------------
//Funkcja przechwytująca kamerkę
function startVideo(){
    //Uzyskanie dostępu do mediów, tu chcemy tylko obraz bez dodatkowych wymagań
    navigator.getUserMedia(
        {video:{}},
        //Jeśli wszystko się powiedzie ustawiamy strumień danych z kamerki jako obiekt źródłowy naszego video
        stream => video.srcObject = stream,
        //Jeśli nie wypisujemy błąd
        err => console.error(err)
    )
}

function dominantExpression(Expressions)
{
    let dominant = {
        value: Expressions[0].value,
        name: Expressions[0].name
    }
    for(let i = 1; i<Expressions.length;i++)
    {
        if(dominant.value<Expressions[i].value)
        {
            dominant.value = Expressions[i].value;
            dominant.name = Expressions[i].name;
        }
    }
    expressionHandle.innerHTML = dominant.name;
}

//WYKRYWANIE TWARZY
//----------------------------------------------------------------------------------------------------
//Wykrycie działania kamerki
video.addEventListener('play', () => {
    //Wytwarza canvas z obrazu kamerki
    const canvas = faceapi.createCanvasFromMedia(video)
    //Dodaje canvas do ciała strony
    container.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    //kod wykonywany co każde 100ms, funkcja asynchroniczna ponieważ biblioteka działa asynchronicznie, nie chcemy oczekiwać ani przeładowywać strony
    setInterval(async () => {
        //Oczekiwanie na wykrycie wszystkich twarzy w kamerce pod uchwytem video
        const detections = await faceapi.detectAllFaces(video, 
        //Zdefiniowanie której biblioteki używamy do wykrycia twarzy i po czym chcemy wykryć twarze
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        
        //zmieniamy rozmiar naszych wykryć na rozmiar naszego obrazu z kamerki
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        //Czyścimy canvas za każdym razem przed narysowaniem kolejnych wykryć
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        //Rysujemy nasze wykrycia na canvasach ustawionych wcześniej
        faceapi.draw.drawDetections(canvas, resizedDetections)
        for(let i=0;i<detections.length;i++)
        {
            happinessValue+=detections[i].expressions.happy;
            sadnessValue+=detections[i].expressions.sad;
            neutralValue+=detections[i].expressions.neutral;
            disgustValue+=detections[i].expressions.disgusted;
            surpriseValue+=detections[i].expressions.surprised;
            angerValue+=detections[i].expressions.angry;
            fearValue+=detections[i].expressions.fearful;
        }

        timer++;
        if(timer==600)
        {
            const Expressions = [
                {
                    value: happinessValue,
                    name: "Happiness"
                },
                {
                    value: neutralValue,
                    name: "Neutral"
                },
                {
                    value: sadnessValue,
                    name: "Sadness"
                },
                {
                    value: disgustValue,
                    name: "Disgust"
                },
                {
                    value: surpriseValue,
                    name: "Surprise"
                },
                {
                    value: fearValue,
                    name: "Fear"
                },
                {
                    value: angerValue,
                    name: "Anger"
                },
            ]
            dominantExpression(Expressions);
            happinessValue = 0;
            sadnessValue = 0;
            neutralValue = 0;
            disgustValue = 0;
            surpriseValue = 0;
            angerValue = 0;
            fearValue = 0;
            timer = 0;
        }

    }, 100)
})