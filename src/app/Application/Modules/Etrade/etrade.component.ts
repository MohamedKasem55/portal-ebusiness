import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { EtradeService } from './etrade.service'

@Component({
  selector: 'etrade',
  templateUrl: './etrade.component.html',
  styleUrls: ['./etrade.component.scss'],
})
export class EtradeComponent implements OnInit {
  result
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: EtradeService,
  ) { }

  ngOnInit() {
    this.setPage(null)
  }
  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getRequestStatusSubscription = this.service.getData().subscribe(
      (result: any) => {
        if (result['errorCode'] !== '0') {
        } else {
          const data = {
            url: result["responseETradeSSOLogin"].url,
            params: {
              'AuthToken': result["responseETradeSSOLogin"].token,
              'jsonbodyrequest': result["responseETradeSSOLogin"].jsonbodyrequest,
              'signedJsonbodyrequest': result["responseETradeSSOLogin"].signedJsonbodyrequest
            }
          }

            const winName = 'eTrade_' + Date.now() + Math.floor(Math.random() * 100000).toString();
            const form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", data.url);
            form.setAttribute("target", winName);

            for (const i in data.params) {
              if (data.params.hasOwnProperty(i)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = i;
                input.value = data.params[i];
                form.appendChild(input);
              }
            }
            document.body.appendChild(form);
            window.open('', winName);
            form.target = winName;
            form.submit();
            document.body.removeChild(form);
          }
      },
      (err) => {
        //console.log(err)
      },
    )
  }
}
