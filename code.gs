function ExamineAll(folder) {
   
     var sheet = SpreadsheetApp.getActiveSheet();
     sheet.appendRow(["Name", "Sharing Access", "Sharing Permission", "Get Editors", "Get Viewers", "Date Created", "Size", "URL", "Download", "Description", "Type"]); //writes the headers
   
     var userProperties = PropertiesService.getUserProperties();
     var continuationToken = userProperties.getProperty('CONTINUATION_TOKEN');
     var start = new Date();
     var end = new Date();
     var maxTime = 1000*60*4.5; // Max safe time, 4.5 mins

     if (continuationToken == null) {
     var files = DriveApp.getFiles();//initial loop on loose files w/in the folder
     } else {
       
       var files = DriveApp.continueFileIterator(continuationToken);//initial loop on loose files w/in the folder
     }

     var cnt = 0;
     var file;

     while (files.hasNext() && end.getTime() - start.getTime() <= maxTime) {
         var file = files.next();
         var listEditors = file.getEditors(); //gets the editor email(s), doesn't show your own as it's assumed
         var editors = [];
         for (var cnt = 0; cnt < listEditors.length; cnt++) {
             editors.push(listEditors[cnt].getEmail());
             Logger.log(editors);
         };
         var listViewers = file.getViewers(); //gets the viewer email(s)
         var viewers = [];
         for (var cnt = 0; cnt < listViewers.length; cnt++) {
             viewers.push(listViewers[cnt].getEmail());
             Logger.log(viewers);
         }
         cnt++;  //data chunk pushes all the file info to the ss
   
        Logger.log(file);
        
         data = [
             file.getName(),
             file.getSharingAccess(),
             file.getSharingPermission(),
             editors.toString(),
             viewers.toString(),
             file.getDateCreated(),
             file.getSize(),
             file.getUrl(),
             "https://docs.google.com/uc?export=download&confirm=no_antivirus&id=" + file.getId(),
             file.getDescription(),
             file.getMimeType(),
         ];

         sheet.appendRow(data);
         end = new Date();
       
        if(files.hasNext()){
        var continuationToken = files.getContinuationToken();
        userProperties.setProperty('CONTINUATION_TOKEN', continuationToken);
        //Logger.log(continuationToken);
        } else {
        // Delete the token
        data = [
             "-END OF DATA-",
         ];
          sheet.appendRow(data);
          
        PropertiesService.getUserProperties().deleteProperty('CONTINUATION_TOKEN');
        }

     };

 }
