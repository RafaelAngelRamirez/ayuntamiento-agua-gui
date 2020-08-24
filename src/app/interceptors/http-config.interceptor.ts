import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { TokenService } from "../services/token.service";
import { map, catchError } from "rxjs/operators";
import { NotificacionesService } from "../services/notificaciones.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private tkService: TokenService,
    private notiSerivce: NotificacionesService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tkService.obtenerToken();

    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
      });
    }

    if (!request.headers.has("Content-Type")) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json"),
      });
    }

    request = request.clone({
      headers: request.headers.set("Accept", "application/json"),
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((_) => {
        let estatus = _ && _.error && _.error.reason ? _.error.reason : "";
        let razon = _.status;
        this.notiSerivce.error(estatus, razon, _);
        return throwError(_);
      })
    );
  }
}
