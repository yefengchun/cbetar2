import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonBackButton, IonIcon, withIonLifeCycle } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './CatalogPage.css';
import { Catalog } from '../models/Catalog';
import Globals from '../Globals';
import { Bookmark, BookmarkType } from '../models/Bookmark';
import { bookmark, arrowBack, home, search } from 'ionicons/icons';
import SearchAlert from '../components/SearchAlert';

interface PageProps extends RouteComponentProps<{
  tab: string;
  path: string;
  label: string;
}> { }

const url = `${Globals.cbetaApiUrl}/catalog_entry?q=`;
class _CatalogPage extends React.Component<PageProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      catalogs: [],
      showSearchAlert: false,
    };
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
    //console.log('fetch');
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

  get isTopCatalog() {
    return this.props.match.params.path == null;
  }

  addBookmarkHandler() {
    (this.props as any).dispatch({
      type: "ADD_BOOKMARK",
      bookmark: new Bookmark({
        type: BookmarkType.CATALOG,
        uuid: this.props.match.params.path,
        selectedText: (this.props.location?.state as any).label || this.props.match.params.path,
        fileName: '',
        work: null,
      }),
    });
  }

  delBookmarkHandler() {
    (this.props as any).dispatch({
      type: "DEL_BOOKMARK",
      uuid: this.props.match.params.path,
    });
  }

  get hasBookmark() {
    return ((this.props as any).bookmarks as [Bookmark])?.find(
      (e) => e.type === BookmarkType.CATALOG && e.uuid === this.props.match.params.path) != null;
  }

  getRows() {
    let rows = Array<object>();
    (this.state as any).catalogs.forEach((catalog: Catalog, index: number) => {
      //if (catalog.nodeType == 'html')
      let routeLink = '';
      if (catalog.work == null) {
        routeLink = `/catalog/${catalog.n}`;
      } else {
        routeLink = `/catalog/work/${catalog.work}`;
      }
      rows.push(
        <IonItem key={`${catalog.n}item` + index} button={true} onClick={async event => {
          event.preventDefault();
          this.props.history.push({
            pathname: routeLink,
            state: { label: catalog.label },
          });
        }}>
          <IonLabel style={{ fontSize: (this.props as any).listFontSize }} key={`${catalog.n}label` + index}>
            {catalog.label}
          </IonLabel>
        </IonItem>
      );
    });
    return rows;
  }

  render() {
    let rows = this.getRows();
    //console.log(`${this.props.match.url} render`)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>目錄</IonTitle>
            <IonButton hidden={this.isTopCatalog} fill="clear" slot='start'>
              <IonBackButton icon={arrowBack} />
            </IonButton>
            <IonButton hidden={this.isTopCatalog} fill="clear" color={this.hasBookmark ? 'warning' : 'primary'} slot='end' onClick={e => this.hasBookmark ? this.delBookmarkHandler() : this.addBookmarkHandler()}>
              <IonIcon icon={bookmark} slot='icon-only' />
            </IonButton>
            <IonButton hidden={this.isTopCatalog} fill="clear" slot='end' onClick={e => this.props.history.push(`/${this.props.match.params.tab}`)}>
              <IonIcon icon={home} slot='icon-only' />
            </IonButton>
            <IonButton fill="clear" slot='end' onClick={e => this.setState({ showSearchAlert: true })}>
              <IonIcon icon={search} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {rows}
          </IonList>

          <SearchAlert
            {...{
            showSearchAlert: (this.state as any).showSearchAlert,
            searchCancel: () => {this.setState({ showSearchAlert: false })},
            searchOk: (keyword: string) => {
              this.props.history.push(`/catalog/search/${keyword}`);
              this.setState({ showSearchAlert: false });
            }, ...this.props
          }}
          />
        </IonContent>
      </IonPage>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    bookmarks: state.settings.bookmarks,
    listFontSize: state.settings.listFontSize,
  }
};

//const mapDispatchToProps = {};

const CatalogPage = withIonLifeCycle(_CatalogPage);

export default connect(
  mapStateToProps,
)(CatalogPage);
