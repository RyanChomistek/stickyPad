import React from 'react';
//import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { IUser } from "shared/build/src"

class GoogleUser implements IUser{
    public constructor(public id: number) {

    }
}

const GoogleLoginPage = ({onLoggedIn}: {onLoggedIn:(user: IUser)=>void}) => {
    const responseGoogleOnSuccess = (response: CredentialResponse) => {
        if(response.credential)
        {
            const userObject: any = jwt_decode(response.credential);
            localStorage.setItem('user', JSON.stringify(new GoogleUser(userObject.sub as number)));
            
            console.log(userObject);
            onLoggedIn(userObject as IUser);
        }
    }

    const responseGoogle = () => {
        console.log("failed to login");
      }
  
    return (
      <div className="">
            <div className="">
              <GoogleOAuthProvider 
                  clientId={`63403846019-dvsjeo4rumm0bg24b0k0lpg8b36k4ee6.apps.googleusercontent.com`}
                  >
               <GoogleLogin
                onSuccess={responseGoogleOnSuccess}
                onError={responseGoogle}
                // auto_select={true}
              />
              </GoogleOAuthProvider>
            </div>
      </div>
    )
  }
  
  export default GoogleLoginPage