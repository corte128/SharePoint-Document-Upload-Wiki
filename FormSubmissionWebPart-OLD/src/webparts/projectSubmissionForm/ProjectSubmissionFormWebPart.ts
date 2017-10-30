// tslint:disable:quotemark
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ProjectSubmissionFormWebPart.module.scss';
import * as strings from 'ProjectSubmissionFormWebPartStrings';

export interface IProjectSubmissionFormWebPartProps {
  description: string;
}

export default class ProjectSubmissionFormWebPartWebPart extends BaseClientSideWebPart<IProjectSubmissionFormWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.projectSubmissionForm}">
        <form runat="server">
          <!-- Title -->
          <div class="${styles.title}">
            Submission Form
          </div>

          <!-- Project title -->
          <div class="${styles.inputContainer}">
            <div class="${styles.inputLabel}">
              Title
            </div>
            <input type="text" class="${styles.inputBox}"/>
          </div>

          <!-- Description -->
          <div class="${styles.inputContainer}">
            <div class="${styles.inputLabel}">
              Description
            </div>
            <textarea class="${styles.textareaBox}"></textarea>
          </div>

          <!-- Upload -->
          <div class="${styles.inputContainer}">
            <div class="${styles.inputLabel}">
              Upload File
            </div>
            <input type="file" name="file" id="file" class="${styles.inputfile}" />
            <label for="file">Choose a file</label>
          </div>
        </form>
      </div>
    `;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  // protected addToDocumentList(){
  //   var ctx = new SP.

  // }
}
