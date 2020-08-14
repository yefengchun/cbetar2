import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonIcon, withIonLifeCycle } from '@ionic/react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './CatalogPage.css';
import { Catalog } from '../models/Catalog';
import Globals from '../Globals';
import WorkPage from './WorkPage';
import { Work } from '../models/Work';
import { star, bookmark, arrowBack, home, search } from 'ionicons/icons';

interface PageProps extends RouteComponentProps<{
  tab: string;
  path: string;
  label: string;
}> { }

const url = `${Globals.cbetaApiUrl}/catalog_entry?q=`;
class _CatalogPage extends React.Component<PageProps> {
  constructor(props) {
    super(props);
    this.state = {
      catalogs: [],
    }
  }

  catalogs = Array<Catalog>();
  ionViewWillEnter() {
    //console.log( 'view will enter' );
    this.fetchData(this.props.match.params.path);
  }

  /*
  componentWillReceiveProps(nextProps){
    console.log(`route changed: ${nextProps.match.url}`)
 }

  componentDidMount() {
    console.log(`did mount: ${this.props.match.url}`)
  }

  componentWillUnmount() {
  }*/

  async fetchData(path: string) {
    console.log('fetch');
    this.catalogs = new Array<Catalog>();

    if (this.props.match.params.path == null) {
      this.catalogs = this.getTopCatalogs();
    } else {

      //try {
      const res = await axios.get(url + path, {
        responseType: 'arraybuffer',
      });
      const data = JSON.parse(new Buffer(res.data).toString());
      this.catalogs = data.results as [Catalog];
    }

    this.setState({ catalogs: this.catalogs });
    return true;

    /*data..forEach((element) {
      catalogs.add(Catalog.fromJson(element));
    });
  } catch (e) {
    fetchFail = true;
  }*/
  }


  getTopCatalogs() {
    let catalogs = Array<Catalog>();
    Object.keys(Globals.topCatalogs).forEach((key) => {
      const catalog: Catalog = {
        n: key,
        nodeType: null,
        work: null,
        label: Globals.topCatalogs[key],
        file: null,
      };
      catalogs.push(catalog);
    });
    return catalogs;
  }

  render() {
    let rows = Array<object>();
    this.state.catalogs.forEach((catalog, index) => {
      //if (catalog.nodeType == 'html')
      let routeLink = '';
      if (catalog.work == null) {
        routeLink = `/catalog/${catalog.n}`;
        rows.push(
          <IonItem key={`${catalog.n}item` + index} button={true} onClick={async event => {
            event.preventDefault();
            this.props.history.push(routeLink);
          }}>
            <a><IonLabel key={`${catalog.n}label` + index}>
              {catalog.label}
            </IonLabel></a>
          </IonItem>
        );
      } else {
        routeLink = `/catalog/work/${catalog.work}`;
        rows.push(
          <IonItem key={`${catalog.n}item` + index} button={true} onClick={async event => {
            event.preventDefault();
            this.props.history.push(routeLink);
          }}>
            <IonLabel key={`${catalog.n}label` + index}>
              {catalog.label}
            </IonLabel>
          </IonItem>
        );
      }
    });
    console.log(`${this.props.match.url} render`)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>目錄</IonTitle>
            <IonButton fill="clear" slot='start'>
              <IonBackButton icon={arrowBack} />
            </IonButton>
            <IonButton fill="clear" slot='end'>
              <IonIcon icon={bookmark} slot='icon-only' />
            </IonButton>
            <IonButton fill="clear" slot='end'>
              <IonIcon icon={home} slot='icon-only' />
            </IonButton>
            <IonButton fill="clear" slot='end'>
              <IonIcon icon={search} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {rows}
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
};

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    counter: state.counter
  }
};

const mapDispatchToProps = {};

const CatalogPage = withIonLifeCycle(_CatalogPage);
/*
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogPage);
*/
export default CatalogPage;
