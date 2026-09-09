# Setting up this layer

These documents state premises for structured human-AI collaboration. Adopt each for the scope it governs, with its prerequisites and point-of-need references available to the intended reader. The documents provide instructions; they do not enforce execution.

## Adopting

- Install the [`route`](../route/README.md) plugin to deliver the premise index and supported point-of-need hooks. Its README carries the installation and host-specific mechanism.
- Or copy or adapt selected premises into your own instruction system. Resolve their cited dependencies; a subset is coherent only when its obligations and required ground still reach its readers.

Avoid delivering the same index twice. When replacing a manual import with hook delivery, verify the new route before removing the old one.

## Verifying

Inspect the canonical index in [`route/scripts/route-premise.mjs`](../route/scripts/route-premise.mjs), then ask a fresh session to reproduce a complete entry and resolve its path. Compare the response with the current entry, including its trigger conditions. This checks what reached that session, not future sessions generally.

Exercise a tool-call delivery moment supported by the installed host and check that the intended entry arrives at that moment. Use the plugin's documented diagnostics when delivery is absent. Merely finding the document on disk establishes no delivery to a reader.

## Adapting

An adopted premise governs within its declared scope. The adopting project's instruction surface states that scope and supplies the environment-specific bindings. For a disagreement about a general principle within that scope, reason from the adopted premise.

Keep project-specific values, artifacts, and conventions on project surfaces. A citation to a general premise must support the actual claim; it cannot lend general authority to an unrelated local choice. Conversely, a general premise must resolve for a reader without this repository's private context.

At revision, read each purportedly general sentence as such a reader. Move a project-dependent claim to its proper surface; preserve in general form any independent obligation that would otherwise be lost. Maintain the references needed to reach it before it binds.
