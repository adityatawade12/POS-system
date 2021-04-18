
var db = firebase.firestore();
let staff
var emp={}
var persOrCont=0;
var arrayEvent=[]
function getStaffData(){
    db.collection("staff").onSnapshot((snapshot) => {
        staff = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // dishes = data;
        // console.log("All data in 'dishes' collection", staff);
        var x=""
        staff.forEach((item)=>{
            x+=`<tr id=${item.id}>
            <td class="text-center"> ${item.name} </td>
            <td class="text-center"> ${item.role} </td>
             <td class="text-center"> Acitve </td>
            
        </tr>`

        })
        $(".staffList").html(x)
        // dishes.forEach((doc) =>{
        //     str = `${doc["Category"]}`;
        //     if (!category.includes(str)) {
        //         category.push(str);
        //     }
        // });

        
                // displayDish(dishes, category);
        
        
    });
}
getStaffData();

$(".attendanceBtn").on("click",function(){
    $(".salary").css({"display":"none"})
    $(".data").css({"display":"none"})
    $(".attendance").css({"display":"block"})

})

$(".salaryBtn").on("click",function(){
    
    $(".data").css({"display":"none"})
    $(".attendance").css({"display":"none"})
    $(".salary").css({"display":"block"})

})

$(".dataBtn").on("click",function(){
    $(".salary").css({"display":"none"})
    $(".attendance").css({"display":"none"})
    $(".data").css({"display":"block"})
    

})

$(".staffList").on("click","tr",function(){
    var empId=$(this).attr('id')
    staffDataRefresh(empId)
    // var empId=$(this).attr('id')
    
    // staff.forEach(item=>{
    //     if(item.id==empId){
    //         emp=item
    //         $(".staffName").val(item.name)
    //         $(".staffNo").val(item.phone)
    //         $(".staffAddress").val(item.address)
    //         $(".staffRole").val(item.role)
    //         $(".staffDateJoined").val(item.joined)
    //         $(".staffEmail").val(item.email)
    //         // try {
    //         //     calendar.eventSources.remove()
    //         // } catch (error) {
                
    //         // }
    //         calendar.getEvents().forEach(item1=>{
    //             item1.remove()
    //         })
    //         var arr=Object.values(item.attendance)
    //         console.log(item.attendance)
    //     //    arr.forEach(it=>{
    //     //        console.log(it)
    //     //    })
    //         arr.forEach(item2=>{
    //             calendar.addEvent(item2)
                
    //         })
    //         // calendar=loadCalendar(item.attendance)
    //         // calendar.fullCalendar( 'addEventSource',  )
    //         // console.log(calendar.getEventSources())
    //         // calendar.addEventSource( item.attendance )
            
    //     }
    // })
    // // console.log(emp)
    // refreshPdocs()
    // refreshCdocs()
//     var p="";
//     emp.personalDocs.forEach(item=>{
//         p+=`<tr id="${item.docLink}"> <td>${item.docName}</td><td class="text-right"><a  href="#myModal" class="viewBtn  btn btn-primary" data-toggle="modal">View</a></td><td class="text-center"><button class="delPBtn btn btn-danger">Delete</button></td></tr>`

//     })
//    $(".pdocs").html(p)
//    p="";
//    emp.contractDocs.forEach(item=>{
//     p+=`<tr id="${item.docLink}"> <td>${item.docName}</td><td class="text-right"><a  href="#myModal" class="viewBtn  btn btn-primary" data-toggle="modal">View</a></td><td class="text-center"><button  class="delCBtn btn btn-danger" >Delete</button></td></tr>`

//     })
//     $(".cdocs").html(p)




})

$(".updateProfile").on("click",function(){
    var washingtonRef = db.collection("staff").doc(emp.id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
         address:$(".staffAddress").val(),
         email:$(".staffEmail").val(),
         name:$(".staffName").val(),
         phone:$(".staffNo").val(),
        role:$(".staffRole").val()
           
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
})

$("tbody.pdocs").on("click",".viewBtn",function(){
    emp.personalDocs.forEach(item=>{
        if(item.docLink==$(this).parent().parent().attr('id')){
            
            $(".modal-body.pdfView").html(`<embed src="https://drive.google.com/file/d/${item.docLink}/preview?usp=sharing" width="100%" height="600vh" />`)
        }
        
    })
    
})

$("tbody.cdocs").on("click",".viewBtn",function(){
    emp.contractDocs.forEach(item=>{
        if(item.docLink==$(this).parent().parent().attr("id")){
            
            $(".modal-body.pdfView").html(`<embed src="https://drive.google.com/file/d/${item.docLink}/preview?usp=sharing" width="100%" height="600vh" />`)
        }

    })
    
})

// document.getElementById('fileInput').onchange = function () {
//     alert('Selected file: ' + this.value);
//   };

$("tbody.pdocs").on("click",".delPBtn",function(){
    // $(".newDocSubmitBtn").css({"display":"none"})
    // $(".deleteBtn").css({"display":"initial"})
    emp.personalDocs.forEach(item=>{
        if(item.docLink==$(this).parent().parent().attr("id")){
            $(".editDocName").val(item.docName)
            console.log("sad")
        }
    })
   
})

$("tbody.cdocs").on("click",".delCBtn",function(){
    // $(".newDocSubmitBtn").css({"display":"none"})
    // console.log("y")
    // $(".deleteBtn").css({"display":"initial"})
    var cId=$(this).parent().parent().attr("id")
    delDocs(cId)
    var docRef = db.collection("staff").doc(emp.id);
    emp.contractDocs.forEach(item=>{
        if(item.docLink==cId){
            docRef.update({
                contractDocs: firebase.firestore.FieldValue.arrayRemove({
                    "docLink":item.docLink,
                    "docName":item.docName
                })
            }).then(()=>{
                staffDataRefresh(emp.id)
            });
        }
    })
    // getStaffData();
    staffDataRefresh(cId)
    // refreshPdocs()
    // refreshCdocs()
    
})
var file=null;
$(".uploadDocFile").change(function(e){
    file=e.target.files[0]
    console.log(e.target.files[0].name)
    $(".uploadDocName").text(e.target.files[0].name)
})
var x=new Date()

function formatDate(dateObject) {
    var month=(dateObject.getMonth()+1).toString();
    
    var dateT=dateObject.getDate().toString();
    if(month.length==1){
        month="0"+month
    }
    if(dateT.length==1){
        dateT="0"+dateObject.getDate().toString()
    }
    return dateObject.getFullYear().toString()+"-"+month+"-"+dateT
}


var datestr=formatDate(x)
console.log(datestr)
var attobj={}
$(".present").on("click",function () {
    
    try {
        calendar.getEventById(datestr).remove()
    } catch (error) {
        
    }
    var endDate=new Date(datestr)
    endDate.setDate(endDate.getDate()+1)
    attobj={
        id:datestr,
        groupId:"present",
        start: datestr,
        end:formatDate(endDate),
        display:"background",
        
      }
    calendar.addEvent(attobj);
    updateAttendance()
    
})
$(".absent").on("click",function () {
    try {
        calendar.getEventById(datestr).remove()
    } catch (error) {
        
    }
    var endDate=new Date(datestr)
    endDate.setDate(endDate.getDate()+1)
    attobj={
        id:datestr,
        groupId:"absent",
        start: datestr,
        end:formatDate(endDate),
        display:"background",
        color:"#541aab"
      }
    calendar.addEvent(attobj);
    updateAttendance()
})
// $('#datetimepicker2').datetimepicker();
$(".aplv").on("click",function () {
    var c=0
    var startDate=new Date($(".std").val())
    var endDate=new Date($(".ndd").val())
    endDate.setDate(endDate.getDate()+1)
    console.log(formatDate(startDate))
    console.log(formatDate(endDate))
    calendar.getEvents().forEach(item=>{
        if((startDate>=item.start && startDate<item.end) || (endDate>=item.start && endDate<item.end)){
            alert("conflicts")
            c=1
        }
        console.log(item.start)
        console.log(item.end)
    })
    if(c!=1){
        calendar.addEvent({
            title:"leave",
            groupId:"leave",
            start: formatDate(startDate),
            end:formatDate(endDate),
            
            // display:"background",
            // color:"#541aab"
          });
          console.log(calendar.getEvents())
          
          updateAttendance()
      
    }
    
    //   calendar.getEvents().forEach(item=>{
    //       console.log(item.start)
    //       console.log(item.end)
    //   })
})

function updateAttendance() {
    calendar.getEvents().forEach(item=>{
             
        arrayEvent.push({
            title:item.title,
            start:formatDate(item.start),
            end:item.end==undefined?formatDate(item.start.getDate()+1):formatDate(item.end),
            groupId:item.groupId,
            display:item.display,
            color:item.color
        })
        

    })
    console.log(arrayEvent)
    var eventObject={}
    arrayEvent.forEach((item3,i)=>{
      for( var m in item3 ) {
          if ( item3[m] == undefined ) {
              delete item3[m];
          }
      } 
        eventObject[i]=item3
    })
    console.log(eventObject)
    var docRef = db.collection("staff").doc(emp.id);
              
    docRef.update({
      
     attendance:eventObject
        
 })
}



$(".paddDoc").on("click",function(){
    persOrCont=0;
    $(".deleteBtn").css({"display":"none"})
    $(".editSubmitBtn").css({"display":"none"})
    
    $(".newDocName").val(" ")
    $(".uploadDocName").text(" ")
    $(".uploadDocFile").val("")
    $(".newDocSubmitBtn").css({"display":"initial"})
})


$(".caddDoc").on("click",function(){
    persOrCont=1;
    $(".newDocName").val(" ")
    $(".uploadDocFile").val("")
    $(".uploadDocName").text(" ")
    $(".deleteBtn").css({"display":"none"})
    $(".editSubmitBtn").css({"display":"none"})
    $(".newDocSubmitBtn").css({"display":"initial"})
})


$(".editSubmitBtn").on("click",function(){
    var docRef = db.collection("staff").doc(emp.id);
    // db.collection("staff").doc(emp.id).update({

    // })
    console.log($(".uploadDocFile").val())
})

$(".deleteBtn").on("click",function(){
        console.log("del")
    // $.ajax({
    //     type: "DELETE",
    //     beforeSend: function(request) {
    //         request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
            
    //     },
    //     // headers:{ 
    //     //     "Content-Type": "application/json"
    //     // },
    //     url: "https://www.googleapis.com/drive/v2/files/"+id,
    //     // data:JSON.stringify({
    //     //     "title":id
    //     // }),
    //     // xhr: function () {
    //     //     var myXhr = $.ajaxSettings.xhr();
    //     //     if (myXhr.upload) {
    //     //         myXhr.upload.addEventListener('progress', that.progressHandling, false);
    //     //     }
    //     //     return myXhr;
    //     // },
    //     success: function (data) {
    //         console.log(data);
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     },
    //     async: true,
    //     // data: formData,
        
    //     cache: false,
    //     // contentType: false,
    //     processData: false,
    //     timeout: 60000
    // });
})

function delDocs(id) {
    getToken()
     $.ajax({
        type: "DELETE",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
            
        },
        // headers:{ 
        //     "Content-Type": "application/json"
        // },
        url: "https://www.googleapis.com/drive/v2/files/"+id,
        // data:JSON.stringify({
        //     "title":id
        // }),
        // xhr: function () {
        //     var myXhr = $.ajaxSettings.xhr();
        //     if (myXhr.upload) {
        //         myXhr.upload.addEventListener('progress', that.progressHandling, false);
        //     }
        //     return myXhr;
        // },
        success: function (data) {
            console.log(data);
            
        },
        error: function (error) {
            console.log(error);
        },
        async: false,
        // data: formData,
        
        cache: false,
        // contentType: false,
        processData: false,
        timeout: 60000
    });
    
}

function refreshPdocs() {
    var p="";
    emp.personalDocs.forEach(item=>{
        p+=`<tr id="${item.docLink}"> <td>${item.docName}</td><td class="text-right"><a  href="#myModal" class="viewBtn  btn btn-primary" data-toggle="modal">View</a></td><td class="text-center"><button class="delPBtn btn btn-danger">Delete</button></td></tr>`

    })
   $(".pdocs").html(p)
}

function refreshCdocs() {
   var p="";
    emp.contractDocs.forEach(item=>{
     p+=`<tr id="${item.docLink}"> <td>${item.docName}</td><td class="text-right"><a  href="#myModal" class="viewBtn  btn btn-primary" data-toggle="modal">View</a></td><td class="text-center"><button  class="delCBtn btn btn-danger" >Delete</button></td></tr>`
 
     })
     $(".cdocs").html(p)
}

function staffDataRefresh(empId){
    // var empId=$(this).attr('id')
    console.log("471")
    staff.forEach(item=>{
        if(item.id==empId){
            emp=item
            $(".staffName").val(item.name)
            $(".staffNo").val(item.phone)
            $(".staffAddress").val(item.address)
            $(".staffRole").val(item.role)
            $(".staffDateJoined").val(item.joined)
            $(".staffEmail").val(item.email)
            // try {
            //     calendar.eventSources.remove()
            // } catch (error) {
                
            // }
            calendar.getEvents().forEach(item1=>{
                item1.remove()
            })
            var arr=Object.values(item.attendance)
            console.log(item.attendance)
        //    arr.forEach(it=>{
        //        console.log(it)
        //    })
            arr.forEach(item2=>{
                calendar.addEvent(item2)
                
            })
            refreshPdocs()
    refreshCdocs()
            // calendar=loadCalendar(item.attendance)
            // calendar.fullCalendar( 'addEventSource',  )
            // console.log(calendar.getEventSources())
            // calendar.addEventSource( item.attendance )
            
        }
    })
    // console.log(emp)
    // refreshPdocs()
    // refreshCdocs()
}

$(".newDocSubmitBtn").on("click",function () {
    var fileName=$(".newDocName").val()
    var upload = new Upload(file);
    var fileId="";
    var docRef = db.collection("staff").doc(emp.id);
    getToken()
    if (persOrCont==0){
        //pers
        fileId=upload.doUpload("1YfQpuljYgeicw9n5TYqpPG09bvuwh5Wp");
        docRef.update({
            personalDocs: firebase.firestore.FieldValue.arrayUnion({
                "docLink":fileId,
                "docName":fileName
            })
        }).then(()=>{
            
            staffDataRefresh(emp.id)
        })
    }
    else{
        fileId=upload.doUpload("1Kt21l6edZho0oxm2tkzml-lD0831bYmF");
        docRef.update({
            contractDocs: firebase.firestore.FieldValue.arrayUnion({
                "docLink":fileId,
                "docName":fileName
            })
        }).then(()=>{
            
            staffDataRefresh(emp.id)
        });
    }
    
    console.log(emp.id)
    

    // getStaffData();

    // staffDataRefresh(emp.id)
})