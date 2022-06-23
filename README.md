# Log

## Install

``` shell
yarn add @djedi/log
```

## Usage

``` typescript
import {logger} from '@djedi/log';

logger.info('Bah');
logger.profile('test');
```

### Instrumentations

On peut instrumenter des fonctions:

``` typescript
import { logger, logCall } from '@djedi/log';

const m = logCall(
  (a: number, b: number) => {
    return a + b;
  },
  { name: 'totot', profiling: true }
);

function n(bla: string, a: number) {
  console.log(bla, a);
}
const nn = logCall(n);
console.log(m(1, 2));
n('eee', 7); // Pas instrumentée
nn('eee', 7);
```

On peut instrumenter les fonctions d'un object:

``` typescript
import { logger, logObject } from '@djedi/log';

const obj = {
  a: 4,
  b: (a: number) => a,
  c: 6,
  d: {
    a: (a: number) => a,
  },
};

// Instrumente que le premier niveau
const objl = logObject(obj, { name: 'obj' });
objl.b(5);
objl.d.a(5); // Cette function n'est pas instrumentée

// Instrumente que les deux premiers niveaux
const objll = logObject(obj, { name: 'obj2', depth: 2 });
objll.b(5);
objll.d.a(5);
```

#### Options

Pour les appels de fonctions:

| Option    | Desciption                                                               |
|-----------|--------------------------------------------------------------------------|
| logger    | logger à utiliser. Par défaut le logger par défaut                       |
| name      | nom de la fonction. Par defaut, cherche à extraire le nom de la fonction |
| level     | log level à utiliser. Défaut: silly                                      |
| profiling | Active le profiling de la fonction. Defaut: faux                         |
| uuid      | Tag les appels, retours et erreurs avec uuid                             |
| extra     | Champs extra à ajouter aux logs                                          |

Pour les objets:

Tous les champs précédents plus:

| Option | Desciption                              |
|--------|-----------------------------------------|
| depth  | profondeur d'instrumentation. Défaut: 1 |


 ## Configuration

 | key                       | desciption                               |
 |---------------------------|------------------------------------------|
 | log:level                 | log level                                |
 | log:dir                   | log directory for files logging          |
 | log:datePattern           | File format date pattern                 |
 | log:zippedArchive         | File gzipped                             |
 | log:maxFiles              | Max number of files when rotating        |
 | log:maxSize               | Max size of file before rotating         |
 | log:logstash:disabled     | when true, explicit disable logstash log |
 | log:logstash:host         | logstash http host                       |
 | log:logstash:port         | logstash http port                       |
 | log:logstash:path         | logstash http path                       |
 | log:logstash:auth         | logstash http  auth object               |
 | log:logstash:ssl          | use ssl. True by default                 |
 | log:sentry:disabled       | when true, explicit disable sentry log   |
 | log:sentry:dsn            | sentry dsn                               |
 | log:sentry:level          | sentry log level                         |
 | application:name          |                                          |
 | application:component     |                                          |
 | application:releasenumber | Release number of the application        |
 | application:gittag        | Git tag                                  |
 | application:gitbranch     | Git current branch                       |
