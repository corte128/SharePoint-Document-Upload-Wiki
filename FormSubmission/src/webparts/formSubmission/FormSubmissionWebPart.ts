// tslint:disable:quotemark
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'FormSubmissionWebPartStrings';
import FormSubmission from './components/FormSubmission';
import { IFormSubmissionProps } from './components/IFormSubmissionProps';

require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

export interface IFormSubmissionWebPartProps {
  description: string;
  siteUrl: string;
}

export default class FormSubmissionWebPart extends BaseClientSideWebPart<IFormSubmissionWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFormSubmissionProps > = React.createElement(
      FormSubmission,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
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
