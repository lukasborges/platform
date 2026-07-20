import { net, protocol } from 'electron';
import { dirname } from 'path';
import { pathToFileURL } from 'url';

import { BX_PROTOCOL, LEGACY_BX_PROTOCOL } from './const';
import handlers from './handlers';

protocol.registerSchemesAsPrivileged([
  {
    scheme: BX_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
    },
  },
  {
    scheme: LEGACY_BX_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

export function start() {
  const handleRequest = (req: GlobalRequest) => {
    const parsedUrl = new URL(req.url);
    const handler = handlers.find(h => h.hostname === parsedUrl.hostname);

    if (!handler) {
      return new Response(new Blob([`Handler not found for ${req.url}`]), { status: 404 });
    }
    if (!parsedUrl.pathname) {
      return new Response(new Blob([`Empty path in ${req.url}`]), { status: 404 });
    }

    if (parsedUrl.pathname !== '/') {
      const fileUrl = `${dirname(handler.filePath)}/${parsedUrl.pathname.substring(1)}`;
      return net.fetch(pathToFileURL(fileUrl).toString());
    }

    return net.fetch(pathToFileURL(handler.filePath).toString());
  };

  protocol.handle(BX_PROTOCOL, handleRequest);
  protocol.handle(LEGACY_BX_PROTOCOL, handleRequest);
}
