import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }

