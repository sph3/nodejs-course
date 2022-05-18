import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User[] {
    const requestingUser = this.usersRepository.findById(user_id);
    if (!requestingUser.admin) {
      throw new Error("Only admins can perform this action");
    }
    const usersList = this.usersRepository.list();
    return usersList;
  }
}

export { ListAllUsersUseCase };
