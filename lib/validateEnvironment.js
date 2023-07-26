/**
 * Ensure envs are set before running
 * @returns {void}
 */
export function validateEnvironment() {
  const requiredEnvs = ['GIT_TOKEN', 'REPO_DIR'];
  const missingEnvs = [];

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  });

  if (missingEnvs.length) {
    console.log('Required envs are missing, please add them to your .env:');
    missingEnvs.forEach((env) => {
      console.log('  -', env);
    });
    process.exit(1);
  }
}
