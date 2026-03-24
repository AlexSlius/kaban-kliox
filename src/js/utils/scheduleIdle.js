export const scheduleIdle = window.requestIdleCallback
	? (cb, opts) => window.requestIdleCallback(cb, opts)
	: (cb) => setTimeout(cb, 1);
