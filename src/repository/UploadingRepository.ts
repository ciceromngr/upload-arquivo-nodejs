import { EntityRepository, Repository } from "typeorm";
import { Uploading } from "../database/entities/Uploading";

@EntityRepository(Uploading)
class UploadingRepository extends Repository<Uploading>{

}

export { UploadingRepository }