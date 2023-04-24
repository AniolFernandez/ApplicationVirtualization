import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    private static API_ENDPOINT: string = window.location.origin; //"http://localhost:3000";

    //Intercepta cada crida a l'API per a afegir-hi els tokens necessàris + l'endpoint correcte
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const modifiedReq = req.clone({
            url: ApiInterceptor.API_ENDPOINT + req.url,
            headers: this.setAuthHeaders(req.headers),
        });
        return next.handle(modifiedReq);
    }

    //Llegeix si hi és el token d'accés i l'afegeix als headers
    setAuthHeaders(headers: HttpHeaders){
        let token = localStorage.getItem('token');
        if(token)
            headers=headers.set('Authorization', `Bearer ${token}`);
        return headers;
    }

    //Utilitzat per a realitzar el login i settingn del token
    public static saveToken(token: string){
        localStorage.setItem('token', token);
    }
}