export interface IFormSubmissionProps {
  description: string;
  siteUrl: string;
}

export interface IFormSubmissionWebPartState {
  listTitles: string[];
  loadingLists: boolean;
  error: string;
}
