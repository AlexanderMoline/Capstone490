import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { SearchMissingComponent } from './search-missing/search-missing.component';
import { ContactComponent } from './contact/contact.component';
import { ListViewComponent } from './list-view/list-view.component';
import { DetailViewComponent } from './detail-view/detail-view.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'CAMUP - Home'
    },
    {
        path: 'about',
        component: AboutComponent,
        title: 'CAMUP - About Us'
    },
    {
        path: 'faq',
        component: FaqComponent,
        title: 'CAMUP - Frequently Asked Questions'
    },
    {
        path: 'search',
        component: SearchMissingComponent,
        title: 'CAMUP - Search'
    },
    {
        path: 'search/results',
        component: ListViewComponent,
        title: 'CAMUP - Search'
    },
    {
        path: 'search/results/:case_number',
        component: DetailViewComponent,
        title: 'CAMUP - Case details'
    },
    {
        path: 'contact',
        component: ContactComponent,
        title: 'CAMUP - Contact'
    }
];
