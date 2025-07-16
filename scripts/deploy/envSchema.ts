import { IsString, IsNotEmpty } from 'class-validator';

export class EnvSchema {
    @IsString()
    @IsNotEmpty()
    _IMAGE_NAME!: string;

    @IsString()
    @IsNotEmpty()
    _IMAGE_TAG!: string;

    @IsString()
    @IsNotEmpty()
    _DEPLOY_NAME!: string;

    @IsString()
    @IsNotEmpty()
    _DEPLOY_INFRA_REPO_OWNER!: string;

    @IsString()
    @IsNotEmpty()
    _DEPLOY_INFRA_REPO!: string;

    @IsString()
    @IsNotEmpty()
    _DEPLOY_PATH!: string;

    @IsString()
    @IsNotEmpty()
    _DEPLOY_TEMPLATE!: string;

    @IsString()
    @IsNotEmpty()
    BRANCH_NAME!: string;

    @IsString()
    @IsNotEmpty()
    GITHUB_TOKEN!: string;
}
