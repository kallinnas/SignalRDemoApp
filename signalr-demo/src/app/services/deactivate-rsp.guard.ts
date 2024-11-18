import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { RspGameComponent } from "../games/rsp-game/rsp-game.component";


@Injectable({ providedIn: 'root' })
export class DeactivateRspGuard  implements CanDeactivate<RspGameComponent> {

  canDeactivate(component: RspGameComponent): boolean {
    component.rspGameService.disconnectConnection();
    return true;
  }
}