// tslint:disable:quotemark
import SPError from '@microsoft/sp-core-library/lib/SPError';
import EventArgs from '@microsoft/sp-core-library/lib/events/EventArgs';
import * as React from 'react';
import styles from './FormSubmission.module.scss';
import { IFormSubmissionProps } from './IFormSubmissionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IFormSubmissionDocumentListState } from './IFormSubmissionDocumentListStates';

export default class FormSubmission extends React.Component<IFormSubmissionProps, IFormSubmissionDocumentListState> {
  constructor(props?: IFormSubmissionProps, context?: any) {
    super();

    this.state = {
      listTitle: "",
      listDescription: "",
      fileData: "",
      fileName: "",
      loadingLists: false,
      error: null
    };

    this.addToDocumentList = this.addToDocumentList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    // this.uploadFileToDocumentLibrary = this.uploadFileToDocumentLibrary.bind(this);
  }

  /* ----------------------------------- Adding to List ---------------------------------- */
  private addToDocumentList():void {
    // setting the react state for the request
    this.setState({
      loadingLists: true,
      error:null,
      listTitle: "",
      listDescription: "",
      fileData: "",
      fileName: ""
    });

    console.log("===================Form Data========================");
    console.log(this.state.listTitle);
    console.log(this.state.listDescription);
    console.log(this.state.fileData);
    console.log(this.state.fileName);
    console.log("====================================================");

    console.log("Variable Initialization");
    // variable initialization and declaration
    const context: SP.ClientContext = new SP.ClientContext(this.props.siteUrl);
    const projectList: SP.List = context.get_web().get_lists().getByTitle("project_document_list");
    const projectItemCreateInfo: SP.ListItemCreationInformation = new SP.ListItemCreationInformation();
    var projectListItem: SP.ListItem = null;

    console.log("uploading the file");
    this.uploadFileToDocumentLibrary(context);

    console.log("Set List Information");
    // getting creation information from the list
    projectListItem = projectList.addItem(projectItemCreateInfo);

    console.log("Adding Project info");
    // adding record of document to the list
    projectListItem.set_item('Title',this.state.listTitle);
    projectListItem.set_item('Description',this.state.listDescription);
    // projectListItem.set_item('Document',this.state.fileData);
    projectListItem.update();

    console.log("loading info");
    // loading content
    context.load(projectListItem);

    console.log("uploading to sharepoint");
    // adding content to sharepoint
    context.executeQueryAsync(this.onQuerySucceeded,
                               this.onQueryFailed);
  }

  /* ------------------------------------ File Upload ---------------------------------------- */
  private uploadFile(value:any): void {
    console.log("filename: "+ value.name);
    // parsing document information out
    var fileName:string = value.name;

    // read from file
    var reader:FileReader = new FileReader();

    reader.onload = (e) => {
      let target:any = e.target;
      let content:string = target.result;
      this.encodeFile(content,fileName);
    };

    reader.onerror = (e) => {
      let target: any = e.target;
      let content: string = target.error;
      alert("Error on file upload: " + content);
    };

    reader.readAsArrayBuffer(this.state.fileData);
  }

  private encodeFile(arrayBuffer:any, fileName:string):void {
    console.log("Converting file contents to base64");
    // convert the file contents into base64 data
    var bytes:Uint8Array = new Uint8Array(arrayBuffer);
    var i:number = 0;
    var length:number = bytes.length;
    var out:string = '';
    for (i = 0, length = bytes.length; i < length; i += 1) {
      out += String.fromCharCode(bytes[i]);
    }
    var base64:SP.Base64EncodedByteArray = new SP.Base64EncodedByteArray(btoa(out));
    console.log(base64);

    this.setState({
      fileData: base64,
      fileName: fileName
    });
  }

  private uploadFileToDocumentLibrary(context:SP.ClientContext):void {
    // get Client Context,Web and List object.
    var oWeb:SP.Web = context.get_web();
    var oList:SP.List = oWeb.get_lists().getByTitle('Documents');

    console.log("Creating file for sharepoint upload");
    // create FileCreationInformation object using the read file data
    var createInfo:SP.FileCreationInformation = new SP.FileCreationInformation();
    createInfo.set_content(this.state.fileData);
    createInfo.set_url(this.state.fileName);

    console.log("Uploading document");
    // add the file to the library
    var uploadedDocument:SP.File = oList.get_rootFolder().get_files().add(createInfo);
    // load client context and execcute the batch
    context.load(uploadedDocument);
    context.executeQueryAsync(this.onQuerySucceeded, this.onQueryFailed);
  }

  /* ------------------------------------- On Change Handler --------------------------------- */
  private handleInputChange(event:any):void {
    const target:any = event.target;
    const value: any = target.type === 'file' ? target.files[0] : target.value;
    const name:any = target.name;

    if(target.type === 'file') {
      var reader: FileReader = new FileReader();

      reader.onload = function (event:any):void{
        console.log("file loaded");
        let target: any = event.target;
        let content: string = target.result;
        this.encodeFile(content, value.name);
      }.bind(this);

      reader.onerror = (e) => {
        let target: any = e.target;
        let content: string = target.error;
        alert("Error on file upload: " + content);
      };

      reader.readAsArrayBuffer(value);
    }else {
      this.setState({
        [name]: value
      });
    }
  }

  /* ----------------------------------- React Render --------------------------------------- */
  public render(): React.ReactElement<IFormSubmissionProps> {
    // const titles: JSX.Element[] = this.state.listTitles.map((listTitle: string, index: number, listTitles: string[]): JSX.Element => {
    //   return <li key={index}>{listTitle}</li>;
    // });

    return (
      <div className={styles.projectSubmissionForm}>
        {/* <form encType="multipart/form-data"> */}
          {/* <!-- Title --> */}
          <div className={styles.title}>
            Submission Form
          </div>

          {/* <!-- Project title --> */}
          <div className={styles.inputContainer}>
            <div className={styles.inputLabel}>
              Title
            </div>
            <input  type="text"
                    className={styles.inputBox}
                    name="listTitle"
                    onChange={this.handleInputChange}/>
          </div>

          {/* <!-- Description --> */}
          <div className={styles.inputContainer}>
            <div className={styles.inputLabel}>
              Description
            </div>
            <textarea name="listDescription"
                      className={styles.textareaBox}
                      onChange={this.handleInputChange} />
          </div>

          {/* <!-- Upload --> */}
          <div className={styles.inputContainer}>
            <div className={styles.inputLabel}>
              Upload File
            </div>
            <input type="file"
                   name="fileData"
                   id="documentUpload"
                   className={styles.inputfile}
                   onChange={this.handleInputChange} />
            <label htmlFor="documentUpload">Choose a file</label>
          </div>

          {/* <!-- Submit --> */}
          <input type="submit" value="Submit" onClick={this.addToDocumentList} />
        {/* </form> */}
      </div>
    );
  }

  /* ----------------------------------- CallBack Functions ----------------------------- */
  private onQuerySucceeded(sender: any, args: any): any {
    alert('Item added succesfully');
  }

  private onQueryFailed(sender: any, args: any): any {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
  }
}
