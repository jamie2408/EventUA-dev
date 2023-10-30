import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from '../layouts/user-layout/user-layout.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { NavbarComponent } from '../commons/navbar/navbar.component';
import { DialogContentCrearEventoDialogComponent } from '../commons/dialog-content-crear-evento-dialog/dialog-content-crear-evento-dialog.component';
import { DialogContentProfileDialogComponent } from '../commons/dialog-content-profile-dialog/dialog-content-profile-dialog.component';
import { DialogContentInfoComponent } from '../commons/dialog-content-info/dialog-content-info.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { BreadcrumbComponent } from '../commons/breadcrumb/breadcrumb.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { IndexComponent } from './index/index.component';
import { EngineComponent } from '../engine/engine.component';
import { UiInfobarBottomComponent } from '../ui/ui-infobar-bottom/ui-infobar-bottom.component';
import { UiSidebarLeftComponent } from '../ui/ui-sidebar-left/ui-sidebar-left.component';
import { UiInfobarTopComponent } from '../ui/ui-infobar-top/ui-infobar-top.component';
import { UiSidebarRightComponent } from '../ui/ui-sidebar-right/ui-sidebar-right.component';
import { UiComponent } from '../ui/ui.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { EventoComponent } from './admin/evento/evento.component';
import { EventosComponent } from './admin/eventos/eventos.component';
import { LugaresComponent } from './admin/lugares/lugares.component';
import { LugarComponent } from './admin/lugar/lugar.component';
import { DocsComponent } from './admin/docs/docs.component';
import { EstadisticasComponent } from './usu/estadisticas/estadisticas.component';
import { UsuNavbarComponent } from '../commons/usu-navbar/usu-navbar.component';
import { UsuFooterComponent } from '../commons/usu-footer/usu-footer.component';
import { FooterComponent } from '../commons/footer/footer.component';
import { NotificacionesComponent } from './admin/notificaciones/notificaciones.component';
import { NotificacionComponent } from './admin/notificacion/notificacion.component';
import { LandingComponent } from './usu/landing/landing.component';
import { EventostotaleschartComponent } from './charts/eventostotaleschart/eventostotaleschart.component';
import { LugaresfavoritoschartComponent } from './charts/lugaresfavoritoschart/lugaresfavoritoschart.component';
import { EventoscreadosComponent } from './charts/eventoscreados/eventoscreados.component';
import { AreasfavoritasComponent } from './charts/areasfavoritas/areasfavoritas.component';
import { MiseventosComponent } from './usu/miseventos/miseventos.component';
import { MieventoComponent } from './usu/mievento/mievento.component';
import { IndexLayoutComponent } from '../layouts/index-layout/index-layout.component';
import { MatChipsModule } from '@angular/material/chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    UserLayoutComponent,
    NavbarComponent,
    DashboardComponent,
    UsuariosComponent,
    BreadcrumbComponent,
    ProgressbarComponent,
    IndexComponent,
    EngineComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent,
    UiComponent,
    PerfilComponent,
    PaginationComponent,
    UsuarioComponent,
    EventoComponent,
    EventosComponent,
    LugaresComponent,
    LugarComponent,
    DocsComponent,
    EstadisticasComponent,
    UsuNavbarComponent,
    UsuFooterComponent,
    FooterComponent,
    NotificacionesComponent,
    NotificacionComponent,
    LandingComponent,
    EventostotaleschartComponent,
    LugaresfavoritoschartComponent,
    EventoscreadosComponent,
    AreasfavoritasComponent,
    MiseventosComponent,
    MieventoComponent,
    IndexLayoutComponent,
    DialogContentInfoComponent,
    DialogContentProfileDialogComponent,
    DialogContentCrearEventoDialogComponent,

  ],
  entryComponents: [DialogContentProfileDialogComponent, DialogContentCrearEventoDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatDialogModule,
    MatStepperModule,
    MatChipsModule,
    MatSelectModule,
    MatTabsModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatInputModule,
    NgxChartsModule

  ]
})
export class PagesModule { }
