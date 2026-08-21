import { Component, inject } from '@angular/core';
import { Products } from '../products/products';
import { signal, computed, effect } from '@angular/core';
import { Observable, of, interval, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductsService } from '@/app/core/services/admin/ecom/products/products';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriesService } from '@/app/core/services/admin/ecom/categories/categories';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [Products],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class HomeComponent {

    counter = signal(0);

    isDarkTheme = signal(false);
    username = signal('manoj Rajpoot');

    name = "Manoj";

    message = signal('');
    buy_now = signal('');
    productName = signal('samsung s 24');
    subscription!: Subscription;
    products = signal<any[]>([]);

    categoriesService = inject(CategoriesService);
    productService = inject(ProductsService)

    search = signal('');


    categories = toSignal(
        this.categoriesService.getDropdown(),
        { initialValue: [] }
    );



    users = toSignal(
        of([
            {
                id: 1, name: 'manoj'
            },
            {
                id: 2, name: 'rajni'
            },
            {
                id: 3, name: 'ranjna'
            }
        ]),

        { initialValue: [] }
    )


    ngOnInit() {
        this.productService.getFeatures().subscribe(res => {
            this.products.set(res);
            console.log(res);
        })
    }

    numbers = new Observable<number>(observer => {
        observer.next(10);
        observer.next(100);
        observer.next(1000);
        observer.next(10000);
        observer.next(100000);
    })


    numbers_of = of(10, 20, 30);
    timer = interval(1000);
    count = signal(0);
    time = signal(new Date());

    increment() {
        this.counter.update(v => v + 1);
    }

    decrement() {
        if (this.counter() > 0) {
            this.counter.update(v => v - 1);
        }

    }
    reset() {
        this.counter.set(0);
    }

    tooggleTheme() {
        this.isDarkTheme.update(v => v ? false : true);
    }

    table = computed(() => this.counter() * 2);





    onUsername() {
        this.username.set('Rajni Rajpoot');

    }

    changeName() {
        this.name = 'rajni rajpoot';
    }


    receiveMessage(msg: string) {
        this.message.set(msg);
    }
    buyNow(msg: string) {
        this.buy_now.set(msg);
    }

    constructor() {

        const count$ = toObservable(this.count);
        count$.subscribe(value => {
            //console.log("observable", value);
        })



        effect(() => {
            localStorage.setItem('username', this.username())
        })

        //obserable
        this.numbers.subscribe(value => {
            console.log(value);
        })

        //of
        this.numbers_of.subscribe(v => {
            console.log(v);
        })

        //timer
        // this.timer.subscribe(v => {
        //     console.log(v);
        // })

        //timer signal



        const timer = interval(1000);

        const subscription = timer.subscribe(value => {

            console.log(value);

        });

        setTimeout(() => {

            subscription.unsubscribe();

            console.log("Observable Stop");

        }, 5000);

        subscription.unsubscribe();
        interval(1000).subscribe(() => {
            this.time.set(new Date());
        })





        this.subscription = interval(1000).subscribe(v => {

            this.count.set(v);
        });


    }
    stopTimer() {
        this.subscription.unsubscribe()

    }


    search$ = toObservable(this.search);

    this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
            return this.http.get('api/search?=' + value);
        })

    )
    .subscribe(res => {
        console.log(res);
    });



users = resource({
    loader: async () => {
        const response = await fetch('this.apiurls/users');
        return response.json();
    }
})


}
