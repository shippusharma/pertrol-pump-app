import { CoreController } from '@/core';
import { IUserSchema } from '@/model/types/user';
import { UserModel } from '@/model/user.mode';
import { internalErrorResponse, sendResponse } from '@/utils/response-handlers';

export async function GET(req: Request, res: Response) {
  try {
    // const { page = 1, limit = 10, offset = 0, sortBy = 'createdAt', orderBy = 'desc', search } = req.query;
    const page = 1,
      limit = 10,
      offset = 0,
      sortBy = 'createdAt' as keyof IUserSchema,
      orderBy = 'desc';

    const coreController = new CoreController<IUserSchema>(UserModel);
    const { pagination, data } = await coreController.pagination({
      page,
      limit,
      offset,
      sortBy,
      orderBy,
      // search,
      // searchKeys: ['name'],
    });

    return sendResponse(200, 'All users details.', { pagination, data });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
