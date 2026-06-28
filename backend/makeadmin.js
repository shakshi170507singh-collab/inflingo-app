const prisma = require('./lib/prisma')

async function main() {
  const user = await prisma.user.update({
    where: { email: 'test@mcc.com' }, // replace with your email
    data: { role: 'admin' }
  })
  console.log('Done! Role:', user.role)
}

main()
  .catch(console.error)
  .finally(() => process.exit())