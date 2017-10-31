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
      loadingLists: false,
      error: null
    };

    this.addToDocumentList = this.addToDocumentList.bind(this);
  }

  // private getListsTitles(): void {
  //   this.setState({
  //     loadingLists: true,
  //     listTitles: [],
  //     error: null
  //   });

  //   const context: SP.ClientContext = new SP.ClientContext(this.props.siteUrl);
  //   const lists: SP.ListCollection = context.get_web().get_lists();
  //   context.load(lists, 'Include(Title)');
  //   context.executeQueryAsync((sender: any, args: SP.ClientRequestSucceededEventArgs): void => {
  //     const listEnumerator: IEnumerator<SP.List> = lists.getEnumerator();

  //     const titles: string[] = [];
  //     while (listEnumerator.moveNext()) {
  //       const list: SP.List = listEnumerator.get_current();
  //       titles.push(list.get_title());
  //     }

  //     this.setState((prevState: IFormSubmissionState, props: IFormSubmissionProps): IFormSubmissionState => {
  //       prevState.listTitles = titles;
  //       prevState.loadingLists = false;
  //       return prevState;
  //     });
  //   }, (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
  //     this.setState({
  //       loadingLists: false,
  //       listTitles: [],
  //       error: args.get_message()
  //     });
  //   });
  // }

  private addToDocumentList(title:string, description:string, document:string):void {
    // setting the react state for the request
    this.setState({
      loadingLists: true,
      error:null,
      listTitle: "",
      listDescription: "",
      fileData: ""
    });

    // variable initialization and declaration
    const context: SP.ClientContext = new SP.ClientContext(this.props.siteUrl);
    const projectList: SP.List = context.get_web().get_lists().getByTitle("project_document_list");
    const documentList: SP.List = context.get_web().get_lists().getByTitle("Documents");
    const projectItemCreateInfo: SP.ListItemCreationInformation = new SP.ListItemCreationInformation();
    const documentItemCreateInfo: SP.ListItemCreationInformation = new SP.ListItemCreationInformation();
    var projectListItem: SP.ListItem = null;
    var documentListItem: SP.ListItem = null;

    // getting creation information from the list
    projectListItem = projectList.addItem(projectItemCreateInfo);
    documentListItem = documentList.addItem(projectItemCreateInfo);

    // the file is created and converted
    var fileCreateInfo: SP.FileCreationInformation = new SP.FileCreationInformation();
    fileCreateInfo.set_url(this.state.fileData);
    fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
    var fileContent:string = "The content of my new file";

    for (var i:number = 0; i < fileContent.length; i++) {
      fileCreateInfo.get_content().append(fileContent.charCodeAt(i));
    }

    // adding document to the document library
    var newFile:SP.File = documentList.get_rootFolder().get_files().add(fileCreateInfo);
    documentListItem = newFile.get_listItemAllFields();
    documentListItem.set_item("Note", "NewValue");


    // adding record of document to the list
    projectListItem.set_item('Title',title);
    projectListItem.set_item('Description',description);
    projectListItem.set_item('Document',document);
    projectListItem.update();

    // loading content
    context.load(projectListItem);
    context.load(documentListItem);

    // adding content to sharepoint
    context.executeQueryAsync(this.onQuerySucceeded,
                               this.onQueryFailed);
  }

private onQuerySucceeded(sender:any,args:any):any {
  alert('Item added succesfully');
}

  private onQueryFailed(sender:any, args:any):any {
  alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

  private handleInputChange(event:any):void {
    const target:any = event.target;
    const value:any = target.value;
    const name:any = target.name;

    this.setState({
      [name]: value
    });
  }

  public render(): React.ReactElement<IFormSubmissionProps> {
    // const titles: JSX.Element[] = this.state.listTitles.map((listTitle: string, index: number, listTitles: string[]): JSX.Element => {
    //   return <li key={index}>{listTitle}</li>;
    // });

    return (
      <div className={styles.projectSubmissionForm}>
        <form method="post" action="addToDocumentList()" encType="multipart/form-data">
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
                   name="file"
                   id="file"
                   className={styles.inputfile}
                   onChange={this.handleInputChange} />
            <label htmlFor="file">Choose a file</label>
          </div>

          {/* <!-- Submit --> */}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
