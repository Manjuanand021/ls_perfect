/**
* Defines global app constants: app root url,
* base data service endpoint url, etc.
*/
export class AppUtils {
  // app root url for all html view requests
//	public static AppRootUrl: string = './LifePortraits';
  public static AppRootUrl:string = '../LifePortraits.aspx';

  // data service base url for all data requests
  // NOTE: change this when new web api data service is created
  // by converting current Default.aspx page, which is not a page,
  // but a FrontController and should be replaced
  // with a single new asp.net 6 Web API controller
  // for all data and view fields config requests.
  public static DataServiceBaseUrl: string = 'Default.aspx';
}
