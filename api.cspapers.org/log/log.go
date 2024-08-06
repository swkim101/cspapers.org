package log

import "fmt"

var (
	flagDebug = false
)

func SetDebugFlag(b bool) {
	flagDebug = b
}

func Debugf(format string, a ...interface{}) {
	if flagDebug {
		fmt.Printf(format+"\n", a...)
	}
}

func Printf(format string, a ...interface{}) {
	fmt.Printf(format+"\n", a...)
}

func Fatalf(format string, a ...interface{}) {
	msg := fmt.Sprintf(format+"\n", a...)
	panic(msg)
}
