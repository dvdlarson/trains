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

//updated version of this would include separate page for admin functions
//auto-sort table by next arrival
//include LAST TRAIN OF THE DAY info for each train & when it is past that time, show upcoming FIRST TRAIN time as next arrival


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
    var tMinutesTillTrain = parseInt(frequency - tRemainder);
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrainFormatted= moment(nextTrain).format("hh:mm");
//add new train to database

 var newTrain=database.ref().push({

         name : trainName,
         destination : destination,
         firstTrainTime : firstTrainTime,
         frequency : frequency,

         nextTrainFormatted : nextTrainFormatted,//we dont even need to keep these two since                                                                                        //they are recalculated each time we pull the data.
         minutesTillTrain : tMinutesTillTrain   //would be better to keep 'last train time'
                                        //and do some calculation to compare now() to last train time and not display that train or else display the next morning's first train time
     });
//reset form fields
    $('#name-input').val('');
    $('#dest-input').val('');
    $('#first-train').val('');
    $('#freq-input').val('');
});


//this is super secure and high tech password validation.
// obvi in real life, the admin page would be a completely separate url with actual security
//but this at least unlocks the add train panel
//i tried to figure out how to have this hidden and unhide it in a clever manner
//but i failed.

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
//do this anytime a new train is added 

database.ref().on("value", function(snapshot){

 //   console.log(snapshot.val());
    snapshot.forEach(function(snapshot) {   //looping through the snapshots within the snapshot
        
        var obj=snapshot.val();
        console.log("sub object");
        console.log(obj); //this is the whole individual train object
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
//add train info to table
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


