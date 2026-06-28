import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    console.log("Interceptor Called");
    console.log("Host:", window.location.hostname);

    const token = localStorage.getItem('token');

    const headers: any = {
        'X-Tenant-Domain': window.location.hostname
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    req = req.clone({
        setHeaders: headers
    });

    console.log(req.headers.get('X-Tenant-Domain'));

    return next(req);
};