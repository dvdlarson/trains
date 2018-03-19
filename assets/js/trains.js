var trainName;
var destination;
var firstTrainTime;
var frequency;
var nextTrain;
var minutesRemaining;
var currentTime;
var diffTime;
var tRemainder;
var minutesTillTrain;
var firstTimeConverted;
var newTrain;



// Initialize Firebase
var config = {
    apiKey: "AIzaSyAxRaedt76Q49vOEVh__aXqIc-yxrx18zQ",
    authDomain: "trains-1dd27.firebaseapp.com",
    databaseURL: "https://trains-1dd27.firebaseio.com",
    projectId: "trains-1dd27",
    storageBucket: "",
    messagingSenderId: "743132825128"
  };
  firebase.initializeApp(config);

var database = firebase.database();



$("#add-train").on("click", function(){
    //get form values
    trainName = $('#name-input').val().trim();
    destination = $('#dest-input').val().trim();
    firstTrainTime = $('#first-train').val().trim();
    frequency = $('#freq-input').val().trim();
    firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var tMinutesTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrainFormatted= moment(nextTrain).format("hh:mm");
//add new train to database

 var newTrain=database.ref().push({

         name : trainName,
         destination : destination,
         firstTrainTime : firstTrainTime,
         frequency : frequency,
         nextTrainFormatted : nextTrainFormatted,
         minutesTillTrain : tMinutesTillTrain

     });
//reset form fields
$('#name-input').val('');
$('#dest-input').val('');
$('#first-train').val('');
$('#freq-input').val('');
});


// var trainScheduleRef = firebase.database().ref().orderByKey("minutesTillTrain");

// trainScheduleRef.once("value").then(function(snapshot){
//     alert("a child was added");
// })

// database.ref().on("value", function(function(schedulesSnapshot) {
//     schedulesSnapshot.forEach(function (trainSnapshot) {
//         var obj = trainSnapshot.val();
//         console.log(obj.name,obj.destination,obj.firstTrainTime,obj.frequency);
//     }
//     )
// }); 

$("#adminButton").on("click",function(event){
    event.preventDefault();
    var correctpw = "admin";
    var correctID = "admin";
    var enteredPW = $("#adminPwd").val();
    var enteredID = $("#adminID").val();
    console.log(enteredPW,enteredID);
    if (enteredPW==correctpw && enteredID==correctID) {
        $("#adminPanel").attr("style","display:block");
    }
});

database.ref().on("value", function(snapshot){

 //   console.log(snapshot.val());
    snapshot.forEach(function(snapshot) {
        
        var obj=snapshot.val();
        console.log("sub object");
        console.log(obj);
//recalculate current values for each train
        trainName = obj.name;
        destination = obj.destination;
        firstTrainTime = obj.firstTrainTime;
        frequency = obj.frequency;
        firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        currentTime = moment();
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % frequency;
        var tMinutesTillTrain = parseInt(frequency - tRemainder);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrainFormatted= moment(nextTrain).format("HH:mm");

        $("#schedule tbody").append(
            "<tr class='table-row' id=" + "'" + trainName + "'" +">" 
            + "<td class='col-xs-3'>" + trainName + "</td>"
            + "<td class='col-xs-3'>" + destination + "</td>"
            + "<td class='col-xs-2'>" + nextTrainFormatted + "</td>"
            + "<td class='col-xs-2'>" + tMinutesTillTrain + "</td>"
            + "</tr>"
        ); 
       
    })
    
});

