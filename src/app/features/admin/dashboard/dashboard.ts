import { Component } from '@angular/core';
import { NotificationsWidget } from './../../../features/admin/components/notificationswidget';
import { StatsWidget } from './../../../features/admin/components/statswidget';
import { RecentSalesWidget } from './../../../features/admin/components/recentsaleswidget';
import { BestSellingWidget } from './../../../features/admin/components/bestsellingwidget';
import { RevenueStreamWidget } from './../../../features/admin/components/revenuestreamwidget';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {

}
