import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'users'
})
export class UserPipe implements PipeTransform {

  transform(user: User): any {
    return `Username: ${user.username}, Mail: ${user.email}`
  }

}
