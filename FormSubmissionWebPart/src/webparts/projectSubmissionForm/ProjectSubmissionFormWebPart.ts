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
}
