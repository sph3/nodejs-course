import { Request, Response } from "express";
import { User } from "modules/users/model/User";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

class ShowUserProfileController {
  constructor(private showUserProfileUseCase: ShowUserProfileUseCase) {}

  handle(req: Request, res: Response): Response {
    const { user_id } = req.params;

    let user: User;
    try {
      user = this.showUserProfileUseCase.execute({ user_id });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }

    return res.status(200).json(user);
  }
}

export { ShowUserProfileController };
