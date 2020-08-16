import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonAlert
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';
import getSavedStore from './redux/store';
import { bookmark, book, settings } from 'ionicons/icons';
import CatalogPage from './pages/CatalogPage';
import WorkPage from './pages/WorkPage';
import WebViewPage from './pages/WebViewPage';
import * as serviceWorker from './serviceWorker';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SettingsPage from './pages/SettingsPage';
import BookmarkPage from './pages/BookmarkPage';
import SearchPage from './pages/SearchPage';

let store = getSavedStore();
/*
class DebugRouter extends IonReactRouter {
  constructor(props: any) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2))
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}
*/

// Apply the dark mode setting.
const state = store.getState();
document.body.classList.toggle('dark', state.settings.darkMode);

let showUpdateAlertCallback: any;

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      showUpdateAlert: false,
    };
    showUpdateAlertCallback = () => {
      this.setState({showUpdateAlert: true});
    };
  }
  render() {
    return (
      <Provider store={store}>
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet animated={false}>
                <Route path="/:tab(catalog)/webview/:work/:path/:label" render={props => <WebViewPage {...props} />} exact={true} />
                <Route path="/:tab(catalog)/work/:path/:label" component={(props: any) => <WorkPage {...props} />} exact={true} />
                <Route path="/:tab(catalog)/search/:keyword" render={props => <SearchPage {...props} />} exact={true} />
                <Route path="/:tab(catalog)/catalog/:path/:label" component={(props: any) => <CatalogPage {...props} />} exact={true} />
                <Route path="/:tab(catalog)" component={(props: any) => <CatalogPage {...props} />} exact={true} />
                <Route path="/:tab(bookmarks)" component={BookmarkPage} exact={true} />
                <Route path={`/:tab(bookmarks)/search/:keyword`} render={props => <SearchPage {...props} />} exact={true} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/" render={() => <Redirect to="/bookmarks" />} exact={true} />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="bookmarks" href="/bookmarks">
                  <IonIcon icon={bookmark} />
                </IonTabButton>
                <IonTabButton tab="catalog" href="/catalog">
                  <IonIcon icon={book} />
                </IonTabButton>
                <IonTabButton tab="settings" href="/settings">
                  <IonIcon icon={settings} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
          <IonAlert
            isOpen={(this.props as any).showUpdateAlert}
            header={'App更新已下載，請關閉、重新啟動app完成更新。'}
            buttons={[
              {
                text: '確定',
                cssClass: 'primary',
                handler: (value) => {
                  this.setState({
                    showUpdateAlert: false,
                  });
                },
              }
            ]}
          />
        </IonApp>
      </Provider>
    );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess: () => {console.log('Precache app loaded!');},
  onUpdate: showUpdateAlertCallback,
});

export default App;
