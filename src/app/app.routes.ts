import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';

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
        component: SearchComponent,
        title: 'CAMUP - Search'
    },
    {
        path: 'contact',
        component: ContactComponent,
        title: 'CAMUP - Contact'
    }
];
