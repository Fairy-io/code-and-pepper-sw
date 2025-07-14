import { plugin } from 'bun';

plugin({
    name: 'graphql-loader',
    setup(build) {
        build.onLoad({ filter: /\.gql$/ }, async (args) => {
            const content = await Bun.file(
                args.path,
            ).text();

            const virtualModule = `export default \`${content}\`;`;

            return {
                contents: virtualModule,
                loader: 'js',
            };
        });
    },
});
