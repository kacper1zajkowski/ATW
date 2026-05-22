# ATW
All Things Weather- whats going on outside the window?

Overengineered dashboard with environmental data, temperature, UV index, pollen and moon phases. Project aiming for being sort of "case study" for Apigee usage- aggregating different APIs.

PROJECT ARCH
 frontend & backend monorepo, front mainly in react + tailwind, backend is a simple node.js BFF layer. For eye-candy, 3d moon object with lighting implemented in three.j. Dashboard is 90% built with Claude code (like most things nowadays) and im not skilled in FEng, so feel free to raise issues if anything looks odd.


Apigee functionalities covered by ATW:
- API proxy
- API tiering / rate limiting
- caching
- Custom policies, key injection
- KVM (key value maping)

TBC